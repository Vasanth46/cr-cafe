package com.crcafe.api.controller;

import com.crcafe.core.model.Item;
import com.crcafe.core.repository.ItemRepository;
import com.crcafe.api.config.ApiPaths;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for managing menu items.
 */
@RestController
@RequestMapping(ApiPaths.ITEMS_ROOT)
@RequiredArgsConstructor
public class ItemController {

    private final ItemRepository itemRepository;

    /**
     * Endpoint to get all available menu items.
     * Any authenticated user can access this list.
     * @return A list of available items.
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Item>> getAvailableItems() {
        return ResponseEntity.ok(itemRepository.findByIsAvailableTrue());
    }
}