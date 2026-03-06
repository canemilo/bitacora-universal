package bitacora.bitacorauniversal.application.log;

import bitacora.bitacorauniversal.infrastructure.persistence.LogEntryEntity;
import bitacora.bitacorauniversal.infrastructure.persistence.LogEntryRepository;
import bitacora.bitacorauniversal.infrastructure.persistence.ObjectRowRepository;
import bitacora.bitacorauniversal.shared.errors.ConflictException;
import bitacora.bitacorauniversal.web.log.dto.CreateLogRequest;
import bitacora.bitacorauniversal.web.log.dto.LogResponse;
import org.springframework.stereotype.Service;
import bitacora.bitacorauniversal.security.AuthContext;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class LogService {

    private final ObjectRowRepository rowRepository;
    private final LogEntryRepository logRepository;

    public LogService(ObjectRowRepository rowRepository, LogEntryRepository logRepository) {
        this.rowRepository = rowRepository;
        this.logRepository = logRepository;
    }

    private String ownerId() { return AuthContext.requireUserId().toString(); }

    public LogResponse create(UUID rowId, CreateLogRequest req) {
        // asegurar que la fila existe y pertenece al owner
        boolean exists = rowRepository.existsById(rowId);
        if (!exists) throw new ConflictException("Row no encontrada");

        LocalDate eventDate = null;
        if (req.getEventDate() != null && !req.getEventDate().isBlank()) {
            try { eventDate = LocalDate.parse(req.getEventDate().trim()); }
            catch (Exception e) { throw new ConflictException("eventDate inválida (YYYY-MM-DD)"); }
        }

        LogEntryEntity e = new LogEntryEntity();
        e.setOwnerId(ownerId());
        e.setRowId(rowId);
        e.setScore(req.getScore());
        e.setComment(req.getComment().trim());
        e.setEventDate(eventDate);

        LogEntryEntity saved = logRepository.save(e);

        return new LogResponse(saved.getId(), saved.getScore(), saved.getComment(), saved.getEventDate(), saved.getCreatedAt());
    }

    public List<LogResponse> list(UUID rowId) {
        return logRepository.findByOwnerIdAndRowIdOrderByCreatedAtDesc(ownerId(), rowId)
                .stream()
                .map(l -> new LogResponse(l.getId(), l.getScore(), l.getComment(), l.getEventDate(), l.getCreatedAt()))
                .toList();
    }
}
