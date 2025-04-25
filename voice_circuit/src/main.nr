mod utils;

fn main(
    voice_embedding: [Field; 256],
    command_hash: Field,
    voice_commitment: pub Field,
    expected_command_hash: pub Field,
) {
    let calculated_commitment = utils::hash_embedding(voice_embedding);
    assert(calculated_commitment == voice_commitment);
    assert(command_hash == expected_command_hash);
}
