package bitacora.bitacorauniversal.web.template;

import bitacora.bitacorauniversal.application.template.RowService;
import bitacora.bitacorauniversal.web.template.dto.CreateRowRequest;
import bitacora.bitacorauniversal.web.template.dto.RowResponse;
import jakarta.validation.Valid;
import bitacora.bitacorauniversal.web.template.dto.PatchRowRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/templates/{templateId}/rows")
public class RowController {

    private final RowService service;

    @GetMapping("/{rowId}")
    public RowResponse getOne(@PathVariable UUID templateId, @PathVariable UUID rowId) {
        return service.getOne(templateId, rowId);
    }

    @PatchMapping("/{rowId}")
    public RowResponse patch(@PathVariable UUID templateId, @PathVariable UUID rowId,
                             @RequestBody PatchRowRequest req) {
        return service.patch(templateId, rowId, req);
    }
    public RowController(RowService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RowResponse create(@PathVariable UUID templateId, @Valid @RequestBody CreateRowRequest req) {
        return service.create(templateId, req);
    }

    @DeleteMapping("/{rowId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID templateId, @PathVariable UUID rowId) {
        service.delete(templateId, rowId);
    }

    @GetMapping
    public List<RowResponse> list(@PathVariable UUID templateId) {
        return service.list(templateId);
    }
}
