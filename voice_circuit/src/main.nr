mod utils;

fn main(
    voice_embedding: [Field; 256],
    command_hash: Field,
    voice_commitment: pub Field,
    expected_command_hash: pub Field,
) {
    // Validate that the use rknows his voice embedding
    let calculated_commitment = utils::hash_embedding(voice_embedding);
    assert(calculated_commitment == voice_commitment);

    // Validate that the sent command is authorized
    assert(command_hash == expected_command_hash);
}
