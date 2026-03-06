package bitacora.bitacorauniversal.web.log.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class CreateLogRequest {

    @NotNull
    @DecimalMin(value = "0.00")
    @DecimalMax(value = "10.00")
    private BigDecimal score;

    @NotBlank
    @Size(max = 5000)
    private String comment;

    // opcional, formato "YYYY-MM-DD"
    private String eventDate;

    public BigDecimal getScore() { return score; }
    public void setScore(BigDecimal score) { this.score = score; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }
}
