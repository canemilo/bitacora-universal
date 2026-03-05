package bitacora.bitacorauniversal.web.log.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public class LogResponse {
    private UUID id;
    private BigDecimal score;
    private String comment;
    private LocalDate eventDate;
    private Instant createdAt;

    public LogResponse(UUID id, BigDecimal score, String comment, LocalDate eventDate, Instant createdAt) {
        this.id = id;
        this.score = score;
        this.comment = comment;
        this.eventDate = eventDate;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public BigDecimal getScore() { return score; }
    public String getComment() { return comment; }
    public LocalDate getEventDate() { return eventDate; }
    public Instant getCreatedAt() { return createdAt; }
}
