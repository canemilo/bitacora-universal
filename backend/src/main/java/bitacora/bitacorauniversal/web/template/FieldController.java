package bitacora.bitacorauniversal.web.template;

import bitacora.bitacorauniversal.application.template.FieldService;
import bitacora.bitacorauniversal.web.template.dto.CreateFieldRequest;
import bitacora.bitacorauniversal.web.template.dto.FieldResponse;
import bitacora.bitacorauniversal.web.template.dto.PatchFieldRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/templates/{templateId}/fields")
public class FieldController {

    private final FieldService fieldService;

    public FieldController(FieldService fieldService) {
        this.fieldService = fieldService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FieldResponse create(
            @PathVariable UUID templateId,
            @Valid @RequestBody CreateFieldRequest req
    ) {
        return fieldService.create(templateId, req);
    }

    @GetMapping
    public List<FieldResponse> list(@PathVariable UUID templateId) {
        return fieldService.list(templateId);
    }

    @PatchMapping("/{fieldId}")
    public FieldResponse patch(
            @PathVariable UUID templateId,
            @PathVariable UUID fieldId,
            @Valid @RequestBody PatchFieldRequest req
    ) {
        return fieldService.patch(templateId, fieldId, req);
    }

    @DeleteMapping("/{fieldId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable UUID templateId,
            @PathVariable UUID fieldId
    ) {
        fieldService.delete(templateId, fieldId);
    }
}