package bitacora.bitacorauniversal.application.template;

import bitacora.bitacorauniversal.infrastructure.persistence.TemplateFieldEntity;
import bitacora.bitacorauniversal.infrastructure.persistence.TemplateFieldRepository;
import bitacora.bitacorauniversal.infrastructure.persistence.TemplateRepository;
import bitacora.bitacorauniversal.security.AuthContext;
import bitacora.bitacorauniversal.shared.errors.ConflictException;
import bitacora.bitacorauniversal.web.template.dto.CreateFieldRequest;
import bitacora.bitacorauniversal.web.template.dto.FieldResponse;
import bitacora.bitacorauniversal.web.template.dto.PatchFieldRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import bitacora.bitacorauniversal.application.template.FieldType;
import java.util.List;
import java.util.UUID;

@Service
public class FieldService {

    private final TemplateRepository templateRepository;
    private final TemplateFieldRepository fieldRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public FieldService(TemplateRepository templateRepository, TemplateFieldRepository fieldRepository) {
        this.templateRepository = templateRepository;
        this.fieldRepository = fieldRepository;
    }

    private String ownerId() {
        return AuthContext.requireUserId().toString();
    }

    public FieldResponse create(UUID templateId, CreateFieldRequest req) {
        templateRepository.findByIdAndOwnerId(templateId, ownerId())
                .orElseThrow(() -> new ConflictException("Colección no encontrada o no pertenece al usuario"));

        String key = req.getFieldKey().trim();
        if (fieldRepository.existsByTemplateIdAndFieldKey(templateId, key)) {
            throw new ConflictException("Ya existe un atributo con ese nombre interno");
        }

        String typeStr = req.getDataType().trim().toUpperCase();
        FieldType type = FieldType.valueOf(typeStr);

        String optionsJson = validateAndNormalizeOptions(type, req.getOptionsJson());

        TemplateFieldEntity field = new TemplateFieldEntity();
        field.setTemplateId(templateId);
        field.setFieldKey(key);
        field.setLabel(req.getLabel().trim());
        field.setDataType(type.name());
        field.setRequired(req.isRequired());
        field.setOptionsJson(optionsJson);
        field.setOrderIndex(req.getOrderIndex());

        TemplateFieldEntity saved = fieldRepository.save(field);

        return toResponse(saved);
    }

    public List<FieldResponse> list(UUID templateId) {
        templateRepository.findByIdAndOwnerId(templateId, ownerId())
                .orElseThrow(() -> new ConflictException("Colección no encontrada o no pertenece al usuario"));

        return fieldRepository.findByTemplateIdOrderByOrderIndexAsc(templateId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public FieldResponse patch(UUID templateId, UUID fieldId, PatchFieldRequest req) {
        templateRepository.findByIdAndOwnerId(templateId, ownerId())
                .orElseThrow(() -> new ConflictException("Colección no encontrada o no pertenece al usuario"));

        TemplateFieldEntity field = fieldRepository.findByIdAndTemplateId(fieldId, templateId)
                .orElseThrow(() -> new ConflictException("Atributo no encontrado"));

        String newKey = req.getFieldKey().trim();
        if (!field.getFieldKey().equals(newKey)
                && fieldRepository.existsByTemplateIdAndFieldKey(templateId, newKey)) {
            throw new ConflictException("Ya existe otro atributo con ese nombre interno");
        }

        String typeStr = req.getDataType().trim().toUpperCase();
        FieldType type = FieldType.valueOf(typeStr);

        String optionsJson = validateAndNormalizeOptions(type, req.getOptionsJson());

        field.setFieldKey(newKey);
        field.setLabel(req.getLabel().trim());
        field.setDataType(type.name());
        field.setRequired(req.isRequired());
        field.setOptionsJson(optionsJson);
        field.setOrderIndex(req.getOrderIndex());

        TemplateFieldEntity saved = fieldRepository.save(field);

        return toResponse(saved);
    }

    public void delete(UUID templateId, UUID fieldId) {
        templateRepository.findByIdAndOwnerId(templateId, ownerId())
                .orElseThrow(() -> new ConflictException("Colección no encontrada o no pertenece al usuario"));

        TemplateFieldEntity field = fieldRepository.findByIdAndTemplateId(fieldId, templateId)
                .orElseThrow(() -> new ConflictException("Atributo no encontrado"));

        fieldRepository.delete(field);
    }

    private String validateAndNormalizeOptions(FieldType type, String optionsJson) {
        if (type == FieldType.SELECT) {
            if (optionsJson == null || optionsJson.isBlank()) {
                throw new ConflictException("SELECT requiere optionsJson con un array JSON");
            }

            try {
                JsonNode node = objectMapper.readTree(optionsJson);
                if (!node.isArray()) {
                    throw new ConflictException("optionsJson debe ser un array JSON válido");
                }
                return optionsJson;
            } catch (ConflictException e) {
                throw e;
            } catch (Exception e) {
                throw new ConflictException("optionsJson debe ser un array JSON válido, por ejemplo [\"A\",\"B\"]");
            }
        }

        return null;
    }

    private FieldResponse toResponse(TemplateFieldEntity field) {
        return new FieldResponse(
                field.getId(),
                field.getFieldKey(),
                field.getLabel(),
                field.getDataType(),
                field.isRequired(),
                field.getOptionsJson(),
                field.getOrderIndex()
        );
    }
}
