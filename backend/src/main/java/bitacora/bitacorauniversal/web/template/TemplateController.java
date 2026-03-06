package bitacora.bitacorauniversal.web.template;

import bitacora.bitacorauniversal.application.template.TemplateService;
import bitacora.bitacorauniversal.web.template.dto.CreateTemplateRequest;
import bitacora.bitacorauniversal.web.template.dto.PatchTemplateRequest;
import bitacora.bitacorauniversal.web.template.dto.TemplateDetailResponse;
import bitacora.bitacorauniversal.web.template.dto.TemplateResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/templates")
public class TemplateController {

    private final TemplateService templateService;

    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TemplateResponse create(@Valid @RequestBody CreateTemplateRequest req) {
        return templateService.create(req);
    }

    @GetMapping
    public List<TemplateResponse> list() {
        return templateService.list();
    }

    @GetMapping("/{templateId}")
    public TemplateDetailResponse getOne(@PathVariable UUID templateId) {
        return templateService.getOneWithFields(templateId);
    }

    @PatchMapping("/{templateId}")
    public TemplateResponse patch(
            @PathVariable UUID templateId,
            @Valid @RequestBody PatchTemplateRequest req
    ) {
        return templateService.patch(templateId, req);
    }

    @DeleteMapping("/{templateId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID templateId) {
        templateService.delete(templateId);
    }
}