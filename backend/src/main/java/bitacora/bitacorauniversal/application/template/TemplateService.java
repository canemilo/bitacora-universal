package bitacora.bitacorauniversal.application.template;

import bitacora.bitacorauniversal.infrastructure.persistence.TemplateEntity;
import bitacora.bitacorauniversal.infrastructure.persistence.TemplateFieldEntity;
import bitacora.bitacorauniversal.infrastructure.persistence.TemplateFieldRepository;
import bitacora.bitacorauniversal.infrastructure.persistence.TemplateRepository;
import bitacora.bitacorauniversal.security.AuthContext;
import bitacora.bitacorauniversal.shared.errors.ConflictException;
import bitacora.bitacorauniversal.web.template.dto.CreateTemplateRequest;
import bitacora.bitacorauniversal.web.template.dto.FieldResponse;
import bitacora.bitacorauniversal.web.template.dto.TemplateDetailResponse;
import bitacora.bitacorauniversal.web.template.dto.TemplateResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TemplateService {

    private final TemplateRepository repository;
    private final TemplateFieldRepository fieldRepository;

    public TemplateService(TemplateRepository repository,
                           TemplateFieldRepository fieldRepository) {
        this.repository = repository;
        this.fieldRepository = fieldRepository;
    }

    private String ownerId() { return AuthContext.requireUserId().toString(); }

    public TemplateResponse create(CreateTemplateRequest req) {
        String owner = ownerId();
        String name = req.getName().trim();

        if (repository.existsByOwnerIdAndName(owner, name)) {
            throw new ConflictException("Ya existe una plantilla con ese nombre");
        }

        TemplateEntity e = new TemplateEntity();
        e.setOwnerId(owner);
        e.setName(name);
        e.setDescription(req.getDescription() == null ? null : req.getDescription().trim());

        TemplateEntity saved = repository.save(e);
        return new TemplateResponse(saved.getId(), saved.getName(), saved.getDescription(), saved.getCreatedAt(), saved.getUpdatedAt());
    }

    public TemplateDetailResponse getOneWithFields(UUID templateId) {
        String owner = ownerId();
        System.out.println("[TEMPLATE SERVICE] getOneWithFields templateId=" + templateId + " ownerId=" + owner);

        TemplateEntity t = repository.findByIdAndOwnerId(templateId, owner)
                .orElseThrow(() -> new ConflictException("Template no encontrado"));

        List<TemplateFieldEntity> fields = fieldRepository.findByTemplateIdOrderByOrderIndexAsc(templateId);

        List<FieldResponse> fieldResponses = fields.stream()
                .map(f -> new FieldResponse(
                        f.getId(),
                        f.getFieldKey(),
                        f.getLabel(),
                        f.getDataType(),
                        f.isRequired(),
                        f.getOptionsJson(),
                        f.getOrderIndex()
                ))
                .toList();

        return new TemplateDetailResponse(
                t.getId(), t.getName(), t.getDescription(),
                t.getCreatedAt(), t.getUpdatedAt(),
                fieldResponses
        );
    }

    public List<TemplateResponse> list() {
        String owner = ownerId();
        System.out.println("[TEMPLATE SERVICE] list ownerId=" + owner);

        return repository.findByOwnerIdOrderByCreatedAtDesc(owner)
                .stream()
                .map(t -> new TemplateResponse(t.getId(), t.getName(), t.getDescription(), t.getCreatedAt(), t.getUpdatedAt()))
                .toList();
    }
}