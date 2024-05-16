# from google.cloud import storage
from typing import List
from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel
import chromadb

# def upload_blob(bucket_name, source_file_name, destination_blob_name):
#     """Uploads a file to the bucket."""
#     storage_client = storage.Client()
#     bucket = storage_client.bucket(bucket_name)
#     blob = bucket.blob(destination_blob_name)

#     generation_match_precondition = 0

#     blob.upload_from_filename(source_file_name, if_generation_match=generation_match_precondition)

#     print(
#         f"File {source_file_name} uploaded to {destination_blob_name}."
#     )



# def download_blob(bucket_name, source_blob_name, destination_file_name):
#     """Downloads a blob from the bucket."""
#     storage_client = storage.Client()

#     bucket = storage_client.bucket(bucket_name)

#     blob = bucket.blob(source_blob_name)
#     blob.download_to_filename(destination_file_name)

#     print(
#         "Downloaded storage object {} from bucket {} to local file {}.".format(
#             source_blob_name, bucket_name, destination_file_name
#         )
#     )



def embed_text(
    title: List[str] = ["banana", "bread"],
    texts: List[str] = ["banana muffins? ", "banana bread? banana muffins?"],
    task: str = "SEMANTIC_SIMILARITY",
    model_name: str = "textembedding-gecko@003",
) -> List[List[float]]:
    """Embeds texts with a pre-trained, foundational model."""
    model = TextEmbeddingModel.from_pretrained(model_name)
    inputs = [TextEmbeddingInput(text, task, title) for text in texts]
    embeddings = model.get_embeddings(inputs)
    return [embedding.values for embedding in embeddings]



vector_client = chromadb.PersistentClient(path="cl/movie-vectordb/")
collection = vector_client.get_collection(name="movie-plot-embeddings")

def vector_search(plot, title = " "):
    query_emb = embed_text(title=[title], texts=[plot])
    results = collection.query(
    query_embeddings=query_emb,
    n_results=10)

    plots = results["documents"][0]
    titles = []
    for i in results['metadatas'][0]:
        titles.append(i['title'])
    distances = results["distances"][0]

    return {"titles": titles, "plots": plots, "distances": distances}
