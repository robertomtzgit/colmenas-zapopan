package com.zapopan.colmenas.service;

import com.zapopan.colmenas.dto.colmena.ColmenaRequest;
import com.zapopan.colmenas.dto.colmena.ColmenaResponse;

import java.util.List;

public interface ColmenaService {
    List<ColmenaResponse> getAllColmenas();
    ColmenaResponse getColmenaById(Integer id);
    ColmenaResponse createColmena(ColmenaRequest colmenaRequest);
    ColmenaResponse updateColmena(Integer id, ColmenaRequest colmenaRequest);
    void deleteColmena(Integer id);
}
