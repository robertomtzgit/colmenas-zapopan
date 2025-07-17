package com.zapopan.colmenas.service.impl;

import com.zapopan.colmenas.dto.role.RoleRequest;
import com.zapopan.colmenas.dto.role.RoleResponse;
import com.zapopan.colmenas.exception.ResourceNotFoundException;
import com.zapopan.colmenas.model.Role;
import com.zapopan.colmenas.repository.RoleRepository;
import com.zapopan.colmenas.service.RoleService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoleResponse getRoleById(Integer id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role no encontrado con ID: " + id));
        return mapToResponse(role);
    }

    @Override
    public RoleResponse createRole(RoleRequest roleRequest) {
        Role role = Role.builder()
                .nombre(roleRequest.getNombre())
                .build();
        Role savedRole = roleRepository.save(role);
        return mapToResponse(savedRole);
    }

    @Override
    public RoleResponse updateRole(Integer id, RoleRequest roleRequest) {
        Role existingRole = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role no encontrado con ID: " + id));
        existingRole.setNombre(roleRequest.getNombre());
        Role updatedRole = roleRepository.save(existingRole);
        return mapToResponse(updatedRole);
    }

    @Override
    public void deleteRole(Integer id) {
        if (!roleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Role no encontrado con ID: " + id);
        }
        roleRepository.deleteById(id);
    }

    private RoleResponse mapToResponse(Role role) {
        return new RoleResponse(role.getId(), role.getNombre());
    }
}
