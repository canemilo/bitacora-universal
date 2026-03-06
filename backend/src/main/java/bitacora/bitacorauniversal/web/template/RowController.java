package bitacora.bitacorauniversal.web.template;

import bitacora.bitacorauniversal.application.template.RowService;
import bitacora.bitacorauniversal.web.template.dto.CreateRowRequest;
import bitacora.bitacorauniversal.web.template.dto.PatchRowRequest;
import bitacora.bitacorauniversal.web.template.dto.RowResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/templates/{templateId}/rows")
public class RowController {

    private final RowService rowService;

    public RowController(RowService rowService) {
        this.rowService = rowService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RowResponse create(
            @PathVariable UUID templateId,
            @Valid @RequestBody CreateRowRequest req
    ) {
        return rowService.create(templateId, req);
    }

    @GetMapping
    public List<RowResponse> list(@PathVariable UUID templateId) {
        return rowService.list(templateId);
    }

    @GetMapping("/{rowId}")
    public RowResponse getOne(
            @PathVariable UUID templateId,
            @PathVariable UUID rowId
    ) {
        return rowService.getOne(templateId, rowId);
    }

    @PatchMapping("/{rowId}")
    public RowResponse patch(
            @PathVariable UUID templateId,
            @PathVariable UUID rowId,
            @Valid @RequestBody PatchRowRequest req
    ) {
        return rowService.patch(templateId, rowId, req);
    }

    @DeleteMapping("/{rowId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable UUID templateId,
            @PathVariable UUID rowId
    ) {
        rowService.delete(templateId, rowId);
    }
}