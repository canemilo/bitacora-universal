package bitacora.bitacorauniversal.web.log;

import bitacora.bitacorauniversal.application.log.LogService;
import bitacora.bitacorauniversal.web.log.dto.CreateLogRequest;
import bitacora.bitacorauniversal.web.log.dto.LogResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rows/{rowId}/logs")
public class LogController {

    private final LogService service;

    public LogController(LogService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LogResponse create(@PathVariable UUID rowId, @Valid @RequestBody CreateLogRequest req) {
        return service.create(rowId, req);
    }

    @GetMapping
    public List<LogResponse> list(@PathVariable UUID rowId) {
        return service.list(rowId);
    }
}
