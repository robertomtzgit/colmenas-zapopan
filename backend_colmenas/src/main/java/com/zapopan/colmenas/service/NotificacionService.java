package com.zapopan.colmenas.service;

import com.zapopan.colmenas.dto.notificacion.NotificacionRequest;
import com.zapopan.colmenas.dto.notificacion.NotificacionResponse;

import java.util.List;

public interface NotificacionService {
    List<NotificacionResponse> getAllNotificaciones();
    NotificacionResponse getNotificacionById(Integer id);
    NotificacionResponse createNotificacion(NotificacionRequest notificacionRequest);
    NotificacionResponse updateNotificacion(Integer id, NotificacionRequest notificacionRequest);
    void deleteNotificacion(Integer id);
    List<NotificacionResponse> getNotificacionesByUsuarioId(Integer usuarioId);
    List<NotificacionResponse> getUnreadNotificacionesByUsuarioId(Integer usuarioId);
    NotificacionResponse markAsRead(Integer id);
}
