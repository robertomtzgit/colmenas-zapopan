package com.zapopan.colmenas.service;

import com.zapopan.colmenas.dto.role.RoleRequest;
import com.zapopan.colmenas.dto.role.RoleResponse;

import java.util.List;

public interface RoleService {
    List<RoleResponse> getAllRoles();
    RoleResponse getRoleById(Integer id);
    RoleResponse createRole(RoleRequest roleRequest);
    RoleResponse updateRole(Integer id, RoleRequest roleRequest);
    void deleteRole(Integer id);
}
