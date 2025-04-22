use dep::std::hash::pedersen_hash;

pub fn hash_embedding(embedding: [Field; 256]) -> Field {
    let mut hash = pedersen_hash([embedding[0], embedding[1]]);
    for i in 2..256 {
        hash = pedersen_hash([hash, embedding[i]]);
    }
    hash
}
