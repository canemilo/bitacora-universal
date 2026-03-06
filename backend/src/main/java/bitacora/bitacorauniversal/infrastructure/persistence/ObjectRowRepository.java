package bitacora.bitacorauniversal.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ObjectRowRepository extends JpaRepository<ObjectRowEntity, UUID> {

    List<ObjectRowEntity> findByOwnerIdAndTemplateIdOrderByCreatedAtDesc(String ownerId, UUID templateId);

    Optional<ObjectRowEntity> findByIdAndOwnerIdAndTemplateId(UUID id, String ownerId, UUID templateId);
}