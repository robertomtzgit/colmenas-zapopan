package com.zapopan.colmenas.controller;

import com.zapopan.colmenas.dto.notificacion.NotificacionRequest;
import com.zapopan.colmenas.dto.notificacion.NotificacionResponse;
import com.zapopan.colmenas.service.NotificacionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @GetMapping
    public ResponseEntity<List<NotificacionResponse>> getAllNotificaciones() {
        List<NotificacionResponse> notificaciones = notificacionService.getAllNotificaciones();
        return ResponseEntity.ok(notificaciones);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificacionResponse> getNotificacionById(@PathVariable Integer id) {
        NotificacionResponse notificacion = notificacionService.getNotificacionById(id);
        return ResponseEntity.ok(notificacion);
    }

    @PostMapping
    public ResponseEntity<NotificacionResponse> createNotificacion(@Valid @RequestBody NotificacionRequest notificacionRequest) {
        NotificacionResponse createdNotificacion = notificacionService.createNotificacion(notificacionRequest);
        return new ResponseEntity<>(createdNotificacion, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotificacionResponse> updateNotificacion(@PathVariable Integer id, @Valid @RequestBody NotificacionRequest notificacionRequest) {
        NotificacionResponse updatedNotificacion = notificacionService.updateNotificacion(id, notificacionRequest);
        return ResponseEntity.ok(updatedNotificacion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotificacion(@PathVariable Integer id) {
        notificacionService.deleteNotificacion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<NotificacionResponse>> getNotificacionesByUsuarioId(@PathVariable Integer usuarioId) {
        List<NotificacionResponse> notificaciones = notificacionService.getNotificacionesByUsuarioId(usuarioId);
        return ResponseEntity.ok(notificaciones);
    }

    @GetMapping("/usuario/{usuarioId}/unread")
    public ResponseEntity<List<NotificacionResponse>> getUnreadNotificacionesByUsuarioId(@PathVariable Integer usuarioId) {
        List<NotificacionResponse> notificaciones = notificacionService.getUnreadNotificacionesByUsuarioId(usuarioId);
        return ResponseEntity.ok(notificaciones);
    }

    @PutMapping("/{id}/mark-as-read")
    public ResponseEntity<NotificacionResponse> markNotificationAsRead(@PathVariable Integer id) {
        NotificacionResponse updatedNotificacion = notificacionService.markAsRead(id);
        return ResponseEntity.ok(updatedNotificacion);
    }
}
