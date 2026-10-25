package com.crickapp.backend.controller;

import com.crickapp.backend.dto.TeamRequest;
import com.crickapp.backend.dto.TeamResponse;
import com.crickapp.backend.service.TeamService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TeamController.class)
@AutoConfigureMockMvc(addFilters = false)
class TeamControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TeamService teamService;

    @Test
    @DisplayName("POST /api/teams creates a new team and returns 201 Created")
    void createTeam_success_returnsCreated() throws Exception {
        TeamRequest request = new TeamRequest("Delhi Capitals");
        TeamResponse response = new TeamResponse(1L, "Delhi Capitals", null, null, null, List.of());

        when(teamService.createTeam(any(TeamRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/teams")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Delhi Capitals"))
                .andExpect(jsonPath("$.players").isArray());
    }

    @Test
    @DisplayName("POST /api/teams with invalid name returns 400 Bad Request")
    void createTeam_invalidName_returnsBadRequest() throws Exception {
        TeamRequest request = new TeamRequest("ab"); // less than 3 characters

        mockMvc.perform(post("/api/teams")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}
