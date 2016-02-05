#pragma strict

var speed = 20.0;
var rotationSpeed = 5.0;
var shootRange = 15.0;
var attackRange = 30.0;
var shootAngle = 4.0;
var dontComeCloserRange = 5.0;
var delayShootTime = 0.35;
var pickNextWaypointDistance = 2.0;
var target : Transform;
 
private var lastShot = -10.0;
private var isCollided = false; 

// Make sure there is always a character controller
@script RequireComponent (CharacterController)
 
function OnCollisionEnter (col : Collision)
{Debug.Log("entered enter");
    if(col.gameObject.name == "Golem_mesh")
    {
		Debug.Log("Setting bool for Collision");
        isCollided = true;
    }
} 

function OnTriggerEnter (col : Collider)
{Debug.Log("entered enter");
    if(col.gameObject.name == "Golem_mesh")
    {
		Debug.Log("Setting bool for Collision");
        isCollided = true;
    }
} 

function OnCollisionExit(col : Collision) {
		Debug.Log("entered exit");
	if(col.gameObject.name == "Golem_mesh")
    {
		Debug.Log("Reseting bool for Collision");
        isCollided = false;
    }	
}
 
function Start () {
    // Auto setup player as target through tags
    if (target == null  )
        target = GameObject.FindWithTag("Player").transform;
 
    Patrol();
}
 
function Patrol () {

    var curWayPoint : Transform;
    curWayPoint = GetComponent.<Transform>();
    while (true) {
        var waypointPosition = curWayPoint;
        // Are we close to a waypoint? -> pick the next one!
        Debug.Log("before if");
        Debug.Log(""+curWayPoint.position);
        Debug.Log(""+pickNextWaypointDistance);
        if (Vector3.Distance(waypointPosition.position, transform.position) < pickNextWaypointDistance)
        { 
            curWayPoint = PickNextWaypoint(curWayPoint) ;
            Debug.Log("in if condition");
        }
 
        // Attack the player and wait until
        // - player is killed
        // - player is out of sight    
        if (CanSeeTarget ())
            yield StartCoroutine("AttackPlayer");
       
        // Move towards our target
        MoveTowards(waypointPosition.position);
       
        yield;
    }
}
 
 
function CanSeeTarget () : boolean {
    if (Vector3.Distance(transform.position, target.position) > attackRange)
        return false;
       
    var hit : RaycastHit;
    if (Physics.Linecast (transform.position, target.position, hit))
        return hit.transform == target;
 
    return false;
}
 
function Shoot () {
    // Start shoot animation
    GetComponent.<Animation>().CrossFade("Attack1", 0.3);
 
    // Wait until half the animation has played
    yield WaitForSeconds(delayShootTime);
   
    // Fire gun
    BroadcastMessage("attack1");
   
    // Wait for the rest of the animation to finish
    yield WaitForSeconds(GetComponent.<Animation>().clip.length - delayShootTime);
}
 
function AttackPlayer () {
    var lastVisiblePlayerPosition = target.position;
    while (true) {
        if (CanSeeTarget ()) {
            // Target is dead - stop hunting
            if (target == null)
                return;
 
            // Target is too far away - give up
            var distance = Vector3.Distance(transform.position, target.position);
            if (distance > shootRange * 3)
                return;
           
            lastVisiblePlayerPosition = target.position;
            if (distance > dontComeCloserRange)
                MoveTowards (lastVisiblePlayerPosition);
            else
                RotateTowards(lastVisiblePlayerPosition);
 
            var forward = transform.TransformDirection(Vector3.forward);
            var targetDirection = lastVisiblePlayerPosition - transform.position;
            targetDirection.y = 0;
 
            var angle = Vector3.Angle(targetDirection, forward);
 
            // Start shooting if close and play is in sight
            if (distance < shootRange && angle < shootAngle)
                yield StartCoroutine("Shoot");
        } else {
            yield StartCoroutine("SearchPlayer", lastVisiblePlayerPosition);
            // Player not visible anymore - stop attacking
            if (!CanSeeTarget ())
                return;
        }
 
        yield;
    }
}
 
function SearchPlayer (position : Vector3) {
    // Run towards the player but after 3 seconds timeout and go back to Patroling
    var timeout = 3.0;
    while (timeout > 0.0) {
        MoveTowards(position);
 
        // We found the player
        if (CanSeeTarget ())
            return;
 
        timeout -= Time.deltaTime;
        yield;
    }
}
 
function RotateTowards (position : Vector3) {
    SendMessage("SetSpeed", 0.0);
   
    var direction = position - transform.position;
    direction.y = 0;
    if (direction.magnitude < 0.1)
        return;
   
    // Rotate towards the target
    transform.rotation = Quaternion.Slerp (transform.rotation, Quaternion.LookRotation(direction), rotationSpeed * Time.deltaTime);
    transform.eulerAngles = Vector3(0, transform.eulerAngles.y, 0);
}
 
function MoveTowards (position : Vector3) {
    var direction = position - transform.position;
    direction.y = 0;
    if (direction.magnitude < 0.5) {
        SendMessage("SetSpeed", 0.0);
        return;
    }
   
    // Rotate towards the target
    transform.rotation = Quaternion.Slerp (transform.rotation, Quaternion.LookRotation(direction), rotationSpeed * Time.deltaTime);
    transform.eulerAngles = Vector3(0, transform.eulerAngles.y, 0);
 
	var speedModifier :float;
	var forward : Vector3;
 	//Stop character if collision detected
	if(isCollided){
		speedModifier = 0.0f ;
	}
	else{
		// Modify speed so we slow down when we are not facing the target
		forward = 1.0 * transform.TransformDirection(Vector3.forward) ;
		speedModifier = Vector3.Dot(forward, direction.normalized);
		speedModifier = Mathf.Clamp01(speedModifier);
 	}
	
    // Move the character
    direction = forward * speed * speedModifier;
    GetComponent (CharacterController).SimpleMove(direction);
   
    SendMessage("SetSpeed", speed * speedModifier, SendMessageOptions.DontRequireReceiver);
}
 
function PickNextWaypoint (curWaypoint : Transform) {
    // We want to find the waypoint where the character has to turn the least
 
    // The direction in which we are walking
    var forward = transform.TransformDirection(Vector3.forward);
 
    // The closer two vectors, the larger the dot product will be.
    var best = curWaypoint;
    var bestDot = -10.0;
    for (var cur : Transform in curWaypoint) {
        var direction = Vector3.Normalize(cur.transform.position - transform.position);
        var dot = Vector3.Dot(direction, forward);
        if (dot > bestDot && cur != curWaypoint) {
            bestDot = dot;
            best = cur;
        }
    }
   
    return best;
}