const pool = require('../../server.js');

function actionQuery(sql, renderTable){
    pool.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return;
        };
    });
}

const statsQueries = [
    `SELECT victories FROM player WHERE player_id = ($1)`,
    `SELECT defeats FROM player WHERE player_id = ($1)`,
    `WITH  
        all_user_matches as (
        SELECT 
            match_id
        FROM
            match
        WHERE 
            player_1_id = ($1)
        OR 
            player_2_id = ($1))

        every_shot_matches as (
        SELECT 
            CONCAT(target_x, target_y) as coord_hits,
            COUNT(DISTINCT CONCAT(target_x, target_y))
        FROM
            shot
        WHERE
            match_id IN all_user_matches
        AND 
            shooter_id != ($1)

        )
        `,
    ``,
    ``,



]