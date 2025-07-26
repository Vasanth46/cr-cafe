package com.crcafe.api.controller;

import com.crcafe.api.dto.CreateItemRequest;
import com.crcafe.core.model.Item;
import com.crcafe.core.repository.ItemRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Controller for managing menu items.
 */
@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemRepository itemRepository;

    public ItemController(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }
    /**
     * This endpoint gets ALL items (both available and unavailable).
     * This is required for the Owner's Cafe Menu management page, so they can see and manage all items.
     * The worker's Menu Page will filter this list on the frontend to only show available items.
     * Any authenticated user can access this list.
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()") // Securing the endpoint as you suggested
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    // This is the updated endpoint for creating a new item with an image.
    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Item> createItem(@Valid @RequestBody CreateItemRequest request) {
        Item newItem = new Item();
        newItem.setName(request.getName());
        newItem.setPrice(request.getPrice());
        newItem.setImageUrl(request.getImageUrl());
        newItem.setAvailable(true); // New items are available by default

        Item savedItem = itemRepository.save(newItem);
        return new ResponseEntity<>(savedItem, HttpStatus.CREATED);
    }

    // This is the new endpoint for deleting an item.
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        // First, check if the item exists.
        if (!itemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // Attempt to delete the item. The database will prevent this if the item
        // is part of any existing order, which protects your sales history.
        itemRepository.deleteById(id);
        return ResponseEntity.noContent().build(); // Success response for a deletion
    }

    // This existing endpoint is useful for making an item temporarily unavailable.
    @PutMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    public ResponseEntity<Item> setItemAvailability(@PathVariable Long id, @RequestBody boolean isAvailable) {
        return itemRepository.findById(id)
                .map(item -> {
                    item.setAvailable(isAvailable);
                    return ResponseEntity.ok(itemRepository.save(item));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @PatchMapping("/{id}/price")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Item> updateItemPrice(@PathVariable Long id, @RequestBody BigDecimal newPrice) {
        if (newPrice == null || newPrice.compareTo(BigDecimal.ZERO) < 0) {
            return ResponseEntity.badRequest().build();
        }

        return itemRepository.findById(id)
                .map(item -> {
                    item.setPrice(newPrice);
                    Item updatedItem = itemRepository.save(item);
                    return ResponseEntity.ok(updatedItem);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}