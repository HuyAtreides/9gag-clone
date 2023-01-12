package com.huyphan.services;

import com.huyphan.models.Section;
import com.huyphan.models.User;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.repositories.SectionRepository;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SectionService {

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private UserService userService;

    public List<Section> getAllSections() {
        return sectionRepository.findAll();
    }

    @Transactional
    public void addSectionToFavorite(Long id) throws AppException {
        User user = userService.getUserById(Objects.requireNonNull(UserService.getUser()).getId());
        Section section = getSectionById(id);
        user.getFavoriteSections().add(section);
    }

    @Transactional
    public void removeSectionFromFavorite(Long id) throws AppException {
        User user = userService.getUserById(Objects.requireNonNull(UserService.getUser()).getId());
        Section section = getSectionById(id);
        user.getFavoriteSections().remove(section);
    }

    private Section getSectionById(Long id) throws AppException {
        Optional<Section> optionalSection = sectionRepository.findById(id);
        return optionalSection.orElseThrow(() -> new AppException("No section with provided id"));
    }

    public Set<Section> getFavoriteSection() {
        return Objects.requireNonNull(UserService.getUser()).getFavoriteSections();
    }


}
