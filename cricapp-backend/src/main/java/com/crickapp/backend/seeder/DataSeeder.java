package com.crickapp.backend.seeder;

import com.crickapp.backend.model.Player;
import com.crickapp.backend.model.PlayerRole;
import com.crickapp.backend.model.Team;
import com.crickapp.backend.repository.PlayerRepository;
import com.crickapp.backend.repository.TeamRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;

    public DataSeeder(TeamRepository teamRepository, PlayerRepository playerRepository) {
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (teamRepository.count() > 0) {
            return;
        }

        // 1. Create Teams
        Team rcb = teamRepository.save(Team.builder().name("Royal Challengers").players(new ArrayList<>()).build());
        Team mi = teamRepository.save(Team.builder().name("Mumbai Indians").players(new ArrayList<>()).build());
        Team csk = teamRepository.save(Team.builder().name("Chennai Super Kings").players(new ArrayList<>()).build());
        Team kkr = teamRepository.save(Team.builder().name("Kolkata Knight Riders").players(new ArrayList<>()).build());

        // 2. Create Players for RCB
        Player virat = createPlayer("Virat Kohli", PlayerRole.BATSMAN, 35, rcb, 8000, 4, 250);
        Player faf = createPlayer("Faf du Plessis", PlayerRole.BATSMAN, 39, rcb, 4500, 0, 140);
        Player maxwell = createPlayer("Glenn Maxwell", PlayerRole.ALL_ROUNDER, 35, rcb, 3200, 38, 130);
        Player siraj = createPlayer("Mohammed Siraj", PlayerRole.BOWLER, 30, rcb, 120, 95, 85);
        Player dk = createPlayer("Dinesh Karthik", PlayerRole.WICKET_KEEPER, 38, rcb, 4800, 0, 240);
        Player patidar = createPlayer("Rajat Patidar", PlayerRole.BATSMAN, 31, rcb, 850, 0, 30);

        rcb.setCaptain(virat);
        rcb.setViceCaptain(faf);
        rcb.getPlayers().addAll(List.of(virat, faf, maxwell, siraj, dk, patidar));
        teamRepository.save(rcb);

        // 3. Create Players for MI
        Player rohit = createPlayer("Rohit Sharma", PlayerRole.BATSMAN, 37, mi, 6600, 15, 250);
        Player bumrah = createPlayer("Jasprit Bumrah", PlayerRole.BOWLER, 30, mi, 85, 165, 130);
        Player surya = createPlayer("Suryakumar Yadav", PlayerRole.BATSMAN, 34, mi, 3600, 0, 150);
        Player hardik = createPlayer("Hardik Pandya", PlayerRole.ALL_ROUNDER, 31, mi, 2500, 64, 135);
        Player kishan = createPlayer("Ishan Kishan", PlayerRole.WICKET_KEEPER, 26, mi, 2600, 0, 105);
        Player tilak = createPlayer("Tilak Varma", PlayerRole.BATSMAN, 22, mi, 1100, 0, 38);

        mi.setCaptain(rohit);
        mi.setViceCaptain(bumrah);
        mi.getPlayers().addAll(List.of(rohit, bumrah, surya, hardik, kishan, tilak));
        teamRepository.save(mi);

        // 4. Create Players for CSK
        Player dhoni = createPlayer("MS Dhoni", PlayerRole.WICKET_KEEPER, 43, csk, 5200, 0, 260);
        Player jadeja = createPlayer("Ravindra Jadeja", PlayerRole.ALL_ROUNDER, 35, csk, 2900, 160, 240);
        Player ruturaj = createPlayer("Ruturaj Gaikwad", PlayerRole.BATSMAN, 27, csk, 2400, 0, 66);
        Player dube = createPlayer("Shivam Dube", PlayerRole.ALL_ROUNDER, 31, csk, 1500, 5, 60);
        Player chahar = createPlayer("Deepak Chahar", PlayerRole.BOWLER, 32, csk, 120, 78, 80);
        Player theekshana = createPlayer("Maheesh Theekshana", PlayerRole.BOWLER, 24, csk, 30, 45, 40);

        csk.setCaptain(dhoni);
        csk.setViceCaptain(jadeja);
        csk.getPlayers().addAll(List.of(dhoni, jadeja, ruturaj, dube, chahar, theekshana));
        teamRepository.save(csk);

        // 5. Create Players for KKR
        Player shreyas = createPlayer("Shreyas Iyer", PlayerRole.BATSMAN, 29, kkr, 3100, 0, 115);
        Player russell = createPlayer("Andre Russell", PlayerRole.ALL_ROUNDER, 36, kkr, 2400, 115, 125);
        Player narine = createPlayer("Sunil Narine", PlayerRole.ALL_ROUNDER, 36, kkr, 1500, 180, 175);
        Player rinku = createPlayer("Rinku Singh", PlayerRole.BATSMAN, 27, kkr, 900, 0, 45);
        Player chakravarthy = createPlayer("Varun Chakravarthy", PlayerRole.BOWLER, 33, kkr, 25, 75, 70);
        Player salt = createPlayer("Phil Salt", PlayerRole.WICKET_KEEPER, 28, kkr, 650, 0, 25);

        kkr.setCaptain(shreyas);
        kkr.setViceCaptain(russell);
        kkr.getPlayers().addAll(List.of(shreyas, russell, narine, rinku, chakravarthy, salt));
        teamRepository.save(kkr);

        // 6. Create Unassigned Players (for "Add Player" dialog in UI)
        createPlayer("Ben Stokes", PlayerRole.ALL_ROUNDER, 33, null, 1200, 35, 45);
        createPlayer("Steve Smith", PlayerRole.BATSMAN, 35, null, 2500, 9, 100);
        createPlayer("Kane Williamson", PlayerRole.BATSMAN, 34, null, 2100, 0, 78);
        createPlayer("Rashid Khan", PlayerRole.BOWLER, 26, null, 550, 149, 120);
        createPlayer("David Warner", PlayerRole.BATSMAN, 38, null, 6500, 0, 185);
        createPlayer("Mitchell Starc", PlayerRole.BOWLER, 34, null, 150, 65, 40);
    }

    private Player createPlayer(String name, PlayerRole role, Integer age, Team team, int runs, int wickets, int matches) {
        Player player = Player.builder()
                .name(name)
                .role(role)
                .age(age)
                .team(team)
                .totalRuns(runs)
                .totalWickets(wickets)
                .matches(matches)
                .build();
        return playerRepository.save(player);
    }
}
