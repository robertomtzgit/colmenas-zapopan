package com.zapopan.colmenas.repository;

import com.zapopan.colmenas.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {
    List<Notificacion> findByUsuarioId(Integer usuarioId);
    List<Notificacion> findByUsuarioIdAndLeidaFalse(Integer usuarioId);
    List<Notificacion> findByColmenaId(Integer colmenaId);
}

