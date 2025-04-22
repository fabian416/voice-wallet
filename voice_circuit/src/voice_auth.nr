use dep::std::hash::poseidon_hash;

fn main(
    voice_embedding: [Field; 256],
    command_hash: Field,
    voice_commitment: pub Field,
    expected_command_hash: pub Field,
) {
    // Validar que el usuario conoce el embedding original
    let calculated_commitment = poseidon::hash(voice_embedding);
    assert(calculated_commitment == voice_commitment);

    // Validar que el comando enviado es el autorizado
    assert(command_hash == expected_command_hash);
}
