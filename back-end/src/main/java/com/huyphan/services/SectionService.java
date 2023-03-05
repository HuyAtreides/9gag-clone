package com.huyphan.services;

import com.huyphan.models.Section;
import com.huyphan.models.User;
import com.huyphan.models.exceptions.AppException;
import com.huyphan.models.exceptions.UserException;
import com.huyphan.repositories.SectionRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
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
        User user = userService.getCurrentUser();
        Section section = getSectionById(id);
        user.getFavoriteSections().add(section);
    }

    @Transactional
    public void removeSectionFromFavorite(Long id) throws AppException {
        User user = userService.getCurrentUser();
        Section section = getSectionById(id);
        user.getFavoriteSections().remove(section);
    }

    private Section getSectionById(Long id) throws AppException {
        Optional<Section> optionalSection = sectionRepository.findById(id);
        return optionalSection.orElseThrow(() -> new AppException("No section with provided id"));
    }

    public List<Section> getFavoriteSection() throws UserException {
        User user = userService.getCurrentUser();

        return user.getFavoriteSections().stream().collect(Collectors.toList());
    }


}
