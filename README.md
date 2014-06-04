#camomile-client-javascript


###Install  
Copy client.js and the JQuery librairy in the project folder :  
Insert in the HTML code :  
```javascript  
  <script type="text/javascript" src="client.js"></script>
  <script type="text/javascript" src="jquery.js"></script>
  <script>
			var $j = jQuery.noConflict(); 
  </script>
```

###Functions  
N.B. :  callback(data) (where data is the answer of the request (JSON)) is the function for the processing of the answer.

* _login :_  
  login(callback, username, password, addressOfTheServer)
* _logout :_  
  logout(callback)  
* _Create  user :_  
  create_user(callback, name, password, affiliation)  
* _See all users :_  
  all_user(callback)  
* _ACL Get/Set_  
  set_ACL(callback, username, userright, idCorpus, [idMedia[, idLayer[, idAnnotation]]])  
  get_ACL(callback, idCorpus, [idMedia[, idLayer[, idAnnotation]]] )  
  userright is a member of {'N', 'A', 'C', 'D', 'R', 'V'}  
* _Corpus/Media/Layer/Annotation_  
  There are 5 functions for each element X (X a member of  {Corpus, Media, Layer, Annotation}) :  
    * getX(callback, [idCorpus [, idMedia [, idLayer]]]) : return all X  
    * XbyId(callback, idCorpus [, idMedia [, idLayer [, idAnnotation]]]) : return the X with this id  
    * create_X(callback, [idCorpus, [idMedia, [idLayer]]], [Datas of X] : name, fragment_type, ...) : Create on element X with this data
    * set_X(callback, idCorpus, [idMedia, [idLayer[, idAnnotation]]], [Data of X to change]) : Modify the data of the element X 
    * remove_X(callback, idCorpus[, idMedia[, idLayer[, idAnnotation]]]) : Delete the element X  

###Example  
```javascript 
  function cb(data){console.log(data);}
  
  login(cb, "root", "****", "http://lit-shore-5364.herokuapp.com");  
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
  remove_corpus(cb, "538dc54749555402006f1c52" );
  logout(cb);
```
