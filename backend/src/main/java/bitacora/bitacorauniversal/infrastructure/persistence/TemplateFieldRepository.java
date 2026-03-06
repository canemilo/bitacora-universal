package bitacora.bitacorauniversal.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TemplateFieldRepository extends JpaRepository<TemplateFieldEntity, UUID> {
    boolean existsByTemplateIdAndFieldKey(UUID templateId, String fieldKey);
    List<TemplateFieldEntity> findByTemplateIdOrderByOrderIndexAsc(UUID templateId);
}
