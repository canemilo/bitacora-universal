package bitacora.bitacorauniversal.application.template;

import bitacora.bitacorauniversal.infrastructure.persistence.*;
import bitacora.bitacorauniversal.shared.errors.ConflictException;
import bitacora.bitacorauniversal.web.template.dto.CreateRowRequest;
import bitacora.bitacorauniversal.web.template.dto.RowResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import bitacora.bitacorauniversal.web.template.dto.PatchRowRequest;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import bitacora.bitacorauniversal.security.AuthContext;

@Service
public class RowService {

    private final TemplateRepository templateRepository;
    private final TemplateFieldRepository fieldRepository;
    private final ObjectRowRepository rowRepository;
    private final ObjectMapper objectMapper;

    public RowService(TemplateRepository templateRepository,
                      TemplateFieldRepository fieldRepository,
                      ObjectRowRepository rowRepository,
                      ObjectMapper objectMapper) {
        this.templateRepository = templateRepository;
        this.fieldRepository = fieldRepository;
        this.rowRepository = rowRepository;
        this.objectMapper = objectMapper;
    }

    private String ownerId() { return AuthContext.requireUserId().toString(); }

    public RowResponse create(UUID templateId, CreateRowRequest req) {
        templateRepository.findByIdAndOwnerId(templateId, ownerId())
                .orElseThrow(() -> new ConflictException("Template no encontrado o no pertenece al usuario"));

        List<TemplateFieldEntity> fields = fieldRepository.findByTemplateIdOrderByOrderIndexAsc(templateId);
        if (fields.isEmpty()) {
            throw new ConflictException("No puedes crear filas: el template no tiene columnas definidas");
        }

        // index por fieldKey
        Map<String, TemplateFieldEntity> fieldMap = new HashMap<>();
        for (TemplateFieldEntity f : fields) fieldMap.put(f.getFieldKey(), f);

        Map<String, Object> values = req.getValues();

        // 1) claves desconocidas
        for (String key : values.keySet()) {
            if (!fieldMap.containsKey(key)) {
                throw new ConflictException("Campo no permitido en values: " + key);
            }
        }

        // 2) required presentes
        for (TemplateFieldEntity f : fields) {
            if (f.isRequired() && !values.containsKey(f.getFieldKey())) {
                throw new ConflictException("Falta campo obligatorio: " + f.getFieldKey());
            }
        }

        // 3) validación de tipos
        for (Map.Entry<String, Object> entry : values.entrySet()) {
            String key = entry.getKey();
            Object v = entry.getValue();
            TemplateFieldEntity f = fieldMap.get(key);
            validateType(f, v);
        }

        // convertir a JSON string
        String valuesJson;
        try {
            valuesJson = objectMapper.writeValueAsString(values);
        } catch (Exception e) {
            throw new ConflictException("No se pudo serializar values a JSON");
        }

        ObjectRowEntity row = new ObjectRowEntity();
        row.setOwnerId(ownerId());
        row.setTemplateId(templateId);
        row.setDisplayName(req.getDisplayName().trim());
        row.setValuesJson(valuesJson);

        ObjectRowEntity saved = rowRepository.save(row);

        Map<String, Object> map;
        try {
            map = objectMapper.readValue(saved.getValuesJson(), Map.class);
        } catch (Exception e) {
            map = new HashMap<>();
        }
        return new RowResponse(saved.getId(), saved.getDisplayName(), map, saved.getCreatedAt(), saved.getUpdatedAt());
    }

    public List<RowResponse> list(UUID templateId) {
        templateRepository.findByIdAndOwnerId(templateId, ownerId())
                .orElseThrow(() -> new ConflictException("Template no encontrado o no pertenece al usuario"));

        return rowRepository.findByOwnerIdAndTemplateIdOrderByCreatedAtDesc(ownerId(), templateId)
                .stream()
                .map(r -> {
                    Map<String, Object> map;
                    try { map = objectMapper.readValue(r.getValuesJson(), Map.class); }
                    catch (Exception e) { map = new HashMap<>(); }
                    return new RowResponse(r.getId(), r.getDisplayName(), map, r.getCreatedAt(), r.getUpdatedAt());
                })
                .toList();
    }

    public RowResponse getOne(UUID templateId, UUID rowId) {
        templateRepository.findByIdAndOwnerId(templateId, ownerId())
                .orElseThrow(() -> new ConflictException("Template no encontrado o no pertenece al usuario"));

        ObjectRowEntity row = rowRepository.findByIdAndOwnerIdAndTemplateId(rowId, ownerId(), templateId)
                .orElseThrow(() -> new ConflictException("Row no encontrada"));

        Map<String, Object> map;
        try { map = objectMapper.readValue(row.getValuesJson(), Map.class); }
        catch (Exception e) { map = new HashMap<>(); }

        return new RowResponse(row.getId(), row.getDisplayName(), map, row.getCreatedAt(), row.getUpdatedAt());
    }

    public RowResponse patch(UUID templateId, UUID rowId, PatchRowRequest req) {
        templateRepository.findByIdAndOwnerId(templateId, ownerId())
                .orElseThrow(() -> new ConflictException("Template no encontrado o no pertenece al usuario"));

        ObjectRowEntity row = rowRepository.findByIdAndOwnerIdAndTemplateId(rowId, ownerId(), templateId)
                .orElseThrow(() -> new ConflictException("Row no encontrada"));

        List<TemplateFieldEntity> fields = fieldRepository.findByTemplateIdOrderByOrderIndexAsc(templateId);
        if (fields.isEmpty()) throw new ConflictException("Template sin columnas definidas");

        Map<String, TemplateFieldEntity> fieldMap = new HashMap<>();
        for (TemplateFieldEntity f : fields) fieldMap.put(f.getFieldKey(), f);

        // valores actuales
        Map<String, Object> current;
        try { current = objectMapper.readValue(row.getValuesJson(), Map.class); }
        catch (Exception e) { current = new HashMap<>(); }

        // merge parcial
        Map<String, Object> patchValues = req.getValues();
        if (patchValues != null) {
            // 1) claves desconocidas
            for (String key : patchValues.keySet()) {
                if (!fieldMap.containsKey(key)) {
                    throw new ConflictException("Campo no permitido en values: " + key);
                }
            }
            // 2) validar tipos SOLO de lo que viene en el patch
            for (Map.Entry<String, Object> entry : patchValues.entrySet()) {
                TemplateFieldEntity f = fieldMap.get(entry.getKey());
                validateType(f, entry.getValue());
            }

            // aplicar merge (si value=null, se guarda null; si required=true, fallará luego)
            current.putAll(patchValues);
        }

        // 3) required presentes tras merge
        for (TemplateFieldEntity f : fields) {
            if (f.isRequired()) {
                if (!current.containsKey(f.getFieldKey()) || current.get(f.getFieldKey()) == null) {
                    throw new ConflictException("Falta campo obligatorio: " + f.getFieldKey());
                }
            }
        }

        // displayName opcional
        if (req.getDisplayName() != null) {
            String dn = req.getDisplayName().trim();
            if (dn.isEmpty()) throw new ConflictException("displayName no puede quedar vacío");
            row.setDisplayName(dn);
        }

        // guardar values_json
        try {
            row.setValuesJson(objectMapper.writeValueAsString(current));
        } catch (Exception e) {
            throw new ConflictException("No se pudo serializar values a JSON");
        }

        ObjectRowEntity saved = rowRepository.save(row);

        Map<String, Object> out;
        try { out = objectMapper.readValue(saved.getValuesJson(), Map.class); }
        catch (Exception e) { out = new HashMap<>(); }

        return new RowResponse(saved.getId(), saved.getDisplayName(), out, saved.getCreatedAt(), saved.getUpdatedAt());
    }

    public void delete(UUID templateId, UUID rowId) {
        templateRepository.findByIdAndOwnerId(templateId, ownerId())
                .orElseThrow(() -> new ConflictException("Template no encontrado o no pertenece al usuario"));

        ObjectRowEntity row = rowRepository.findByIdAndOwnerIdAndTemplateId(rowId, ownerId(), templateId)
                .orElseThrow(() -> new ConflictException("Row no encontrada"));

        rowRepository.delete(row);
    }


    private void validateType(TemplateFieldEntity field, Object value) {
        String type = field.getDataType();
        if (value == null) {
            if (field.isRequired()) throw new ConflictException("Campo obligatorio no puede ser null: " + field.getFieldKey());
            return;
        }



        switch (FieldType.valueOf(type)) {
            case TEXT -> {
                if (!(value instanceof String)) throw new ConflictException("Campo " + field.getFieldKey() + " debe ser TEXT");
            }
            case NUMBER -> {
                // Jackson suele mapear numbers a Integer/Long/Double/BigDecimal
                if (!(value instanceof Number)) throw new ConflictException("Campo " + field.getFieldKey() + " debe ser NUMBER");
                // ejemplo: aceptar decimal y entero sin más
                new BigDecimal(value.toString());
            }
            case BOOLEAN -> {
                if (!(value instanceof Boolean)) throw new ConflictException("Campo " + field.getFieldKey() + " debe ser BOOLEAN");
            }
            case DATE -> {
                if (!(value instanceof String)) throw new ConflictException("Campo " + field.getFieldKey() + " debe ser DATE (YYYY-MM-DD)");
                try { LocalDate.parse((String) value); }
                catch (Exception e) { throw new ConflictException("Campo " + field.getFieldKey() + " DATE inválida (YYYY-MM-DD)"); }
            }
            case SELECT -> {
                if (!(value instanceof String)) throw new ConflictException("Campo " + field.getFieldKey() + " debe ser SELECT (string)");
                String optionsJson = field.getOptionsJson();
                if (optionsJson == null || optionsJson.isBlank()) {
                    throw new ConflictException("Campo SELECT sin optionsJson configurado: " + field.getFieldKey());
                }
                try {
                    JsonNode arr = objectMapper.readTree(optionsJson);
                    boolean found = false;
                    for (JsonNode n : arr) {
                        if (n.isTextual() && n.asText().equals(value)) { found = true; break; }
                    }
                    if (!found) throw new ConflictException("Valor no permitido para " + field.getFieldKey());
                } catch (ConflictException ce) {
                    throw ce;
                } catch (Exception e) {
                    throw new ConflictException("optionsJson inválido en campo SELECT: " + field.getFieldKey());
                }
            }
        }
    }
}
