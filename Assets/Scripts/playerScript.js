#pragma strict

var player : GameObject;
var speed : float = 1;
 
function Start ()
{
     player = GameObject.FindGameObjectWithTag("Player");
 
     if (!player)
          Debug.Log ("ERROR could not find Player!");
}
 
function Update()
{
     if (!player)
          return;
 
     var distance = Vector3.Distance( player.transform.position, transform.position);
 
     if ( distance < 50  )
     {
          //Debug.Log ("player is close");
         
          var delta = player.transform.position - transform.position;
          delta.Normalize();
         
          var moveSpeed = speed * Time.deltaTime;
     
          transform.position = transform.position + (delta * moveSpeed);
    }
    else
    {
          Debug.Log("not close yet " + distance);
    }
}