import joblib
import openai
import numpy as np
from openai import OpenAI
client = OpenAI()
model = joblib.load("cl/ensemble_model.pkl")

def embed(text, model="text-embedding-3-small"):
   text = text.replace("\n", " ")
   return client.embeddings.create(input = [text], model=model).data[0].embedding

def hit_or_miss (text):
    embedding = embed(text)
    embedding = np.array(embedding).reshape(1, -1)
    prediction = model.predict(embedding)[0]
    return prediction