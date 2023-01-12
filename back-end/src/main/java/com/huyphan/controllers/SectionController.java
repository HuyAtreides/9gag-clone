package com.huyphan.controllers;

import com.huyphan.dtos.SectionDto;
import com.huyphan.mappers.SectionMapper;
import com.huyphan.models.Section;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.services.SectionService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("section")
public class SectionController {

    @Autowired
    private SectionMapper sectionMapper;

    @Autowired
    private SectionService sectionService;

    @GetMapping
    public List<SectionDto> getSections() {
        List<Section> sections = sectionService.getAllSections();

        return sections.stream().map(sectionMapper::toDto).collect(Collectors.toList());
    }

    @PutMapping("favorite/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addSectionToFavorite(@PathVariable Long id) throws AppException {
        sectionService.addSectionToFavorite(id);
    }

    @DeleteMapping("favorite/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeSectionFromFavorite(@PathVariable Long id) throws AppException {
        sectionService.removeSectionFromFavorite(id);
    }

    @ExceptionHandler(AppException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppException handleException(AppException appException) {
        return appException;
    }
}
