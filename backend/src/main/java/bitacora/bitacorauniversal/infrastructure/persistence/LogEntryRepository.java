package bitacora.bitacorauniversal.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LogEntryRepository extends JpaRepository<LogEntryEntity, UUID> {
    List<LogEntryEntity> findByOwnerIdAndRowIdOrderByCreatedAtDesc(String ownerId, UUID rowId);
}
