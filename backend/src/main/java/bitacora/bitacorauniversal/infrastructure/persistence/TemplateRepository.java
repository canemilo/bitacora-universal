package bitacora.bitacorauniversal.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TemplateRepository extends JpaRepository<TemplateEntity, UUID> {
    boolean existsByOwnerIdAndName(String ownerId, String name);
    List<TemplateEntity> findByOwnerIdOrderByCreatedAtDesc(String ownerId);
    Optional<TemplateEntity> findByIdAndOwnerId(UUID id, String ownerId);
}
