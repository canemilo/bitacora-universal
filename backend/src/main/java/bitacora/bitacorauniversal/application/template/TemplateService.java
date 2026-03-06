package bitacora.bitacorauniversal.application.template;

import bitacora.bitacorauniversal.infrastructure.persistence.ObjectRowRepository;
import bitacora.bitacorauniversal.infrastructure.persistence.TemplateEntity;
import bitacora.bitacorauniversal.infrastructure.persistence.TemplateFieldRepository;
import bitacora.bitacorauniversal.infrastructure.persistence.TemplateRepository;
import bitacora.bitacorauniversal.security.AuthContext;
import bitacora.bitacorauniversal.shared.errors.ConflictException;
import bitacora.bitacorauniversal.web.template.dto.FieldResponse;
import bitacora.bitacorauniversal.web.template.dto.PatchTemplateRequest;
import bitacora.bitacorauniversal.web.template.dto.TemplateDetailResponse;
import bitacora.bitacorauniversal.web.template.dto.TemplateResponse;
import org.springframework.stereotype.Service;
import bitacora.bitacorauniversal.web.template.dto.CreateTemplateRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
@Service
public class TemplateService {

    private final TemplateRepository repository;
    private final TemplateFieldRepository fieldRepository;
    private final ObjectRowRepository rowRepository;

    public TemplateService(
            TemplateRepository repository,
            TemplateFieldRepository fieldRepository,
            ObjectRowRepository rowRepository
    ) {
        this.repository = repository;
        this.fieldRepository = fieldRepository;
        this.rowRepository = rowRepository;
    }

    private String ownerId() {
        return AuthContext.requireUserId().toString();
    }

    public List<TemplateResponse> list() {
        return repository.findByOwnerIdOrderByCreatedAtDesc(ownerId())
                .stream()
                .map(t -> new TemplateResponse(
                        t.getId(),
                        t.getName(),
                        t.getDescription(),
                        t.getCreatedAt(),
                        t.getUpdatedAt()
                ))
                .toList();
    }

    public TemplateDetailResponse getOneWithFields(UUID templateId) {
        TemplateEntity template = repository.findByIdAndOwnerId(templateId, ownerId())
                .orElseThrow(() -> new ConflictException("Colección no encontrada o no pertenece al usuario"));

        List<FieldResponse> fields = fieldRepository.findByTemplateIdOrderByOrderIndexAsc(templateId)
                .stream()
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
                template.getId(),
                template.getName(),
                template.getDescription(),
                template.getCreatedAt(),
                template.getUpdatedAt(),
                fields
        );
    }

    public TemplateResponse patch(UUID templateId, PatchTemplateRequest req) {
        TemplateEntity template = repository.findByIdAndOwnerId(templateId, ownerId())
                .orElseThrow(() -> new ConflictException("Colección no encontrada o no pertenece al usuario"));

        String newName = req.getName() != null ? req.getName().trim() : "";
        if (newName.isEmpty()) {
            throw new ConflictException("El nombre de la colección es obligatorio");
        }

        String newDescription = req.getDescription() != null ? req.getDescription().trim() : null;
        if (newDescription != null && newDescription.isEmpty()) {
            newDescription = null;
        }

        template.setName(newName);
        template.setDescription(newDescription);

        TemplateEntity saved = repository.save(template);

        return new TemplateResponse(
                saved.getId(),
                saved.getName(),
                saved.getDescription(),
                saved.getCreatedAt(),
                saved.getUpdatedAt()
        );
    }

    public TemplateResponse create(CreateTemplateRequest req) {
        String name = req.getName() != null ? req.getName().trim() : "";
        if (name.isEmpty()) {
            throw new ConflictException("El nombre de la colección es obligatorio");
        }

        String description = req.getDescription() != null ? req.getDescription().trim() : null;
        if (description != null && description.isEmpty()) {
            description = null;
        }

        TemplateEntity template = new TemplateEntity();
        template.setOwnerId(ownerId());
        template.setName(name);
        template.setDescription(description);

        TemplateEntity saved = repository.save(template);

        return new TemplateResponse(
                saved.getId(),
                saved.getName(),
                saved.getDescription(),
                saved.getCreatedAt(),
                saved.getUpdatedAt()
        );
    }

    @Transactional
    public void delete(UUID templateId) {
        TemplateEntity template = repository.findByIdAndOwnerId(templateId, ownerId())
                .orElseThrow(() -> new ConflictException("Colección no encontrada o no pertenece al usuario"));

        rowRepository.deleteByOwnerIdAndTemplateId(ownerId(), templateId);
        fieldRepository.deleteByTemplateId(templateId);
        repository.delete(template);
    }
}