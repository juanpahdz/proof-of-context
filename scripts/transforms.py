import pandas as pd
import json

def extract_products():
    archivo_xlsx  = '../../Databases/Product - Raw Database.xlsx'  
    df = pd.read_excel(archivo_xlsx)

    lista_brandmodel = df['brandmodel'].tolist()
    archivo_json = '../db/products.json'  

    with open(archivo_json, 'w', encoding='utf-8') as f:
        json.dump(lista_brandmodel, f, indent=2)

def extract_products_by_brand():
    file  = '../../Databases/Product - Raw Database.xlsx'  
    df = pd.read_excel(file)
    df['brand'] = df['brand'].str.strip().str.capitalize()
    df = df.sort_values(by='brand', ascending=True)
    # Inicialización de variables
    data = []
    current_brand = df['brand'][0].strip()
    whole_brand = {"marca":current_brand}
    models = []
    # Iteración
    for ind in df.index:
        if (current_brand != df['brand'][ind].strip()):
            whole_brand = {
                "marca":current_brand,
                "modelos":models
            }
            data.append(whole_brand)
            current_brand = df['brand'][ind].strip()
            models = []
               
        models.append({"nombre":df['model'][ind]})
    #Agregar último elemento
    if (models):
        whole_brand = {
                    "marca":current_brand,
                    "modelos":models
                }
        data.append(whole_brand)

    archivo_json = '../db/db3.json'  
    with open(archivo_json, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

extract_products_by_brand()
