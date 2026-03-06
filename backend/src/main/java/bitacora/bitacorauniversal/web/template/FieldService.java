package bitacora.bitacorauniversal.application.template;

import bitacora.bitacorauniversal.infrastructure.persistence.TemplateFieldEntity;
import bitacora.bitacorauniversal.infrastructure.persistence.TemplateFieldRepository;
import bitacora.bitacorauniversal.infrastructure.persistence.TemplateRepository;
import bitacora.bitacorauniversal.shared.errors.ConflictException;
import bitacora.bitacorauniversal.web.template.dto.CreateFieldRequest;
import bitacora.bitacorauniversal.web.template.dto.FieldResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import bitacora.bitacorauniversal.security.AuthContext;

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

    private String ownerId() { return AuthContext.requireUserId().toString(); }

    public FieldResponse create(UUID templateId, CreateFieldRequest req) {
        // valida template pertenece al owner
        templateRepository.findByIdAndOwnerId(templateId, ownerId())
                .orElseThrow(() -> new ConflictException("Template no encontrado o no pertenece al usuario"));

        String key = req.getFieldKey().trim();
        if (fieldRepository.existsByTemplateIdAndFieldKey(templateId, key)) {
            throw new ConflictException("Ya existe una columna con ese fieldKey");
        }

        String typeStr = req.getDataType().trim().toUpperCase();
        FieldType type = FieldType.valueOf(typeStr); // lanza excepción si no existe

        String optionsJson = req.getOptionsJson();
        if (type == FieldType.SELECT) {
            if (optionsJson == null || optionsJson.isBlank()) {
                throw new ConflictException("SELECT requiere optionsJson (array JSON)");
            }
            // valida que sea JSON array
            try {
                JsonNode node = objectMapper.readTree(optionsJson);
                if (!node.isArray()) throw new IllegalArgumentException("optionsJson no es array");
            } catch (Exception e) {
                throw new ConflictException("optionsJson debe ser un array JSON válido, ej: [\"A\",\"B\"]");
            }
        } else {
            optionsJson = null;
        }

        TemplateFieldEntity f = new TemplateFieldEntity();
        f.setTemplateId(templateId);
        f.setFieldKey(key);
        f.setLabel(req.getLabel().trim());
        f.setDataType(type.name());
        f.setRequired(req.isRequired());
        f.setOptionsJson(optionsJson);
        f.setOrderIndex(req.getOrderIndex());

        TemplateFieldEntity saved = fieldRepository.save(f);

        return new FieldResponse(saved.getId(), saved.getFieldKey(), saved.getLabel(), saved.getDataType(),
                saved.isRequired(), saved.getOptionsJson(), saved.getOrderIndex());
    }

    public List<FieldResponse> list(UUID templateId) {
        templateRepository.findByIdAndOwnerId(templateId, ownerId())
                .orElseThrow(() -> new ConflictException("Template no encontrado o no pertenece al usuario"));

        return fieldRepository.findByTemplateIdOrderByOrderIndexAsc(templateId)
                .stream()
                .map(f -> new FieldResponse(f.getId(), f.getFieldKey(), f.getLabel(), f.getDataType(),
                        f.isRequired(), f.getOptionsJson(), f.getOrderIndex()))
                .toList();
    }
}
