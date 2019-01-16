# -*- coding: utf-8 -*-
"""
Created on Sun Nov  4 23:35:44 2018

@author: ZIED Dammak
"""

import numpy as np
from pymongo import MongoClient
from matplotlib import style
import pandas as pd 

style.use('ggplot')
#calcul de distance selon la formule du ehd 
def calculatedistance(pic1,pic2):
       result=float(0)
       if len(pic1)==2 :
        result=abs(float(pic1[0])-float(pic2[0]))+abs(float(pic1[1])-float(pic2[1]))
       else:
       
        for i in range(1,151):
         if i < 81  : 
           result+=abs(float(pic1[i])-float(pic2[i]))
         elif i > 85:
           result+=abs(float(pic1[i])-float(pic2[i]))           
         else :
           result+=5*abs(float(pic1[i])-float(pic2[i]))
 
       return result
    

class K_Means:
	def __init__(self, k =3, tolerance = 0.0001, max_iterations = 500):
		self.k = k
		self.tolerance = tolerance
		self.max_iterations = max_iterations

	def fit(self, data):

		self.centroids = {}

		#initialisation des centroides , les k éléments dans le dataset vont etre les centroïdes initiaux 
		for i in range(self.k):
			self.centroids[i] = data[i]
            

		#Début des itérations
		for i in range(self.max_iterations):
			self.classes = {}
			for i in range(self.k):
				self.classes[i] = []
			#trouver la distance entre le point et le cluster; choisissez le centroïde le plus proche
			
			for features in data:
				distances = [calculatedistance(features , self.centroids[centroid]) for centroid in self.centroids]
				classification = distances.index(min(distances))
				self.classes[classification].append(features)
			                                				      
			previous = dict(self.centroids)         
			#faire la moyenne des points de chaque cluster pour recalculer les centroïdes
			for classification in self.classes:
				self.centroids[classification] = np.average(self.classes[classification], axis = 0)

			isOptimal = True

			for centroid in self.centroids:

				original_centroid = previous[centroid]
				curr = self.centroids[centroid]
				if np.sum((curr[1:] - original_centroid[1:])/original_centroid[1:] * 100.0) > self.tolerance:
					isOptimal = False
			#sortir de la boucle principale si les résultats sont optimaux, c'est à dire. les centroïdes ne changent pas beaucoup leurs positions (plus que notre tolérance)
			if isOptimal:
				break
	#fonction attribue à chaque point entré le nombre relatif à son appartenance à la liste des clusters		
	def pred(self, data):
		distances = [calculatedistance(data , self.centroids[centroid]) for centroid in self.centroids]
		classification = distances.index(min(distances))
		return classification

def main():        
	
	array_edge=np.loadtxt('C:/Users/ziedd/Desktop/Dammak_Zied/teb/cbir/eh_descriptors/'+'eh1.txt')
	df = pd.DataFrame(array_edge)
	df.index = [np.arange(len(df.index)), df.index]
	X = df.values #returns a numpy array
	V = list(range(0,10000))
	#Ajout de colonne d'indexation pour conserver l'ordre des images lors des manipulations suivantes
	X=np.column_stack((V,X))
	#20 clusters
	K=20
	km = K_Means(K)
	km.fit(X)
	#test avec la fonction pred pour vérifier l'appartenance de l'image numero 800
	km.pred(X[800])
	print("la liste saisie a pour classe :")
	print(km.pred(X[800]))
	
	#Connexion à la base de donnée mongoDB
	client=MongoClient('mongodb://localhost:27017/reverse_search')
	db=client.reverse_search
	#Collection destinée au stockage des différents centroides des classes
	collection1=db.collection_centroid
	#Collection destinée au stockage des lignes d'indexation des images
	collection2=db.collection_edge
	#Parcours des différentes classes et insertion de leurs centroids dans la collection1 : collection_centroid
	for i in range(0,K):
		line_DB1={"cluster":i,"edge_value":','.join(str(e) for e in km.centroids[i][1:])}
		collection1.insert_one(line_DB1)
		print(line_DB1)
	#Parcours des différentes classes 
	for classification in km.classes:
		cluster=classification		
	#Parcours et insertion des différentes lignes relatives à chaque classe dans la collection2 : collection_edge
		for features in km.classes[classification]:
			#features[0] est relatif à la numérotation de chaque image et le reste [1:] est relatif aux coefficients du edge histogram de chaque image 
			line_DB2={"index":int(features[0]),"edge_value":','.join(str(e) for e in features[1:]),"cluster":cluster}
			collection2.insert_one(line_DB2)
  
if __name__ == "__main__":
	main()
