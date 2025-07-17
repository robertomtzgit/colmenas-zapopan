package com.zapopan.colmenas.service;

import com.zapopan.colmenas.dto.usuario.UsuarioRequest;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;

import java.util.List;

public interface UsuarioService {
    List<UsuarioResponse> getAllUsuarios();
    UsuarioResponse getUsuarioById(Integer id);
    UsuarioResponse createUsuario(UsuarioRequest usuarioRequest);
    UsuarioResponse updateUsuario(Integer id, UsuarioRequest usuarioRequest);
    void deleteUsuario(Integer id);
}

