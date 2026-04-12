
const getIspConfig = async (receitanet_id) => {
    const result = await pool.query(
        'SELECT secret_key, ativo FROM isps WHERE receitanet_id = $1',
        [receitanet_id]
    );

    return result.rows[0];
};

