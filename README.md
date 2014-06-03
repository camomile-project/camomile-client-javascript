#camomile-client-javascript


###Installation  
Copier client.js dans le projet + jquery  
Insertion dans le code html :  
```javascript  
  <script type="text/javascript" src="client.js"></script>
  <script type="text/javascript" src="jquery.js"></script>
  <script>
			var $j = jQuery.noConflict(); 
  </script>
```

###Utilisation  
N.B. :  les callbacks ne seront executees que si la requete a le statut success et prennent en parametre le resultat de la requete en format JSON

* _login :_  
  login(callback, username, password, adr) 
  adr : adresse du serveur  
* _logout :_  
  logout(callback)  
* _Creer un utilisateur :_  
  create_user(callback, name, password, affiliation)  
* _Voir tous les utilisateurs :_  
  all_user(callback)  
* _ACL Get/Set_  
  set_ACL(callback, username, userright, idCorpus, [idMedia[, idLayer[, idAnnotation]]])  
  get_ACL(callback, idCorpus, [idMedia[, idLayer[, idAnnotation]]] )  
  userright appartient à {'N', 'A', 'C', 'D', 'R', 'V'}  
* _Corpus/Media/Layer/Annotation_  
  Pour chaque element, 3 fonctions (X appartient {Corpus, Media, Layer, Annotation}, ) :  
    * getX(callback, [idCorpus [, idMedia [, idLayer]]]) : retourne tous les X  
    * XbyId(callback, idCorpus [, idMedia [, idLayer [, idAnnotation]]]) : retourne le X voulu  
    * create_X(callback, [idCorpus, [idMedia, [idLayer]]], [Contenu des elements : Name, fragment_typ, ...]) : cree un element X a partir des entrees  
    * set_X(callback, idCorpus, [idMedia, [idLayer[, idAnnotation]]], [Contenu des elements a changer : Name, fragment_typ, ...]) : cree un element X a partir des entrees  
    * remove_X(callback, idCorpus[, idMedia[, idLayer[, idAnnotation]]]) : supprime l'element dont on a passe tous les ids  

###Exemple  
```javascript 
  function cb(data)[console.log(data);}
  
  login(cb, "root", "camomile", "http://lit-shore-5364.herokuapp.com");  
  all_user(cb);  
  create_user(cb, "test", "test", "test");  
  all_user(cb);  
  getCorpus(cb);
  create_corpus(cb, "Test");  
  getCorpus(cb);
  corpusById(cb, "538dc54749555402006f1c52");
  set_corpus(cb, "538dc54749555402006f1c52", "Test2");
  corpusById(cb, "538dc54749555402006f1c52");
  get_ACL(cb, "538dc54749555402006f1c52");
  set_ACL( cb, "marie", "C", "538dc54749555402006f1c52");  
  remove_corpus(cb, "538dc54749555402006f1c52" )
  logout(cb)
```
