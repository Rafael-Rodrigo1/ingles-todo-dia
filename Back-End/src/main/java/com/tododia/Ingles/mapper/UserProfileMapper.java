package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.response.UserProfileResponse;
import com.tododia.Ingles.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {

    @Mapping(target = "role", source = "role.name")
    UserProfileResponse toResponse(User user);
}
