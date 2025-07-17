package com.zapopan.colmenas.service;

import com.zapopan.colmenas.dto.bitacoraevento.BitacoraEventoRequest;
import com.zapopan.colmenas.dto.bitacoraevento.BitacoraEventoResponse;

import java.util.List;

public interface BitacoraEventoService {
    List<BitacoraEventoResponse> getAllBitacoraEventos();
    BitacoraEventoResponse getBitacoraEventoById(Integer id);
    BitacoraEventoResponse createBitacoraEvento(BitacoraEventoRequest bitacoraEventoRequest);
    void deleteBitacoraEvento(Integer id);
    List<BitacoraEventoResponse> getBitacoraEventosByUsuarioId(Integer usuarioId);
    List<BitacoraEventoResponse> getBitacoraEventosByModulo(String modulo);
}
