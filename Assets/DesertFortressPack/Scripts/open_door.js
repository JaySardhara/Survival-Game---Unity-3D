#pragma strict

//Instruction:
//Make an empty game object and call it "Door"
//Rename your 3D door model to "Body"
//Parent a "Body" object to "Door"
//Make sure thet a "Door" object is in left down corner of "Body" object. The place where a Door Hinge need be
//Add a box collider to "Door" object and make it much bigger then the "Body" model, mark it trigger
//Assign this script to a "Door" game object that have box collider with trigger enabled
//Press "f" to open the door and "g" to close the door
//Make sure the main character is tagged "player"

// Smothly open a door
var smooth = 2.0;
var DoorOpenAngle = 80.0;
var DoorCloseAngle = 0.0;
var open : boolean;
var enter : boolean;

//Main function
function Update ()
{
	if(open == true)
	{
		var target = Quaternion.Euler (transform.localRotation.x, DoorOpenAngle, transform.localRotation.z);
		// Dampen towards the target rotation
		transform.localRotation = Quaternion.Slerp(transform.localRotation, target,
		Time.deltaTime * smooth);
	}

	if(open == false)
	{
		var target1 = Quaternion.Euler (transform.localRotation.x, DoorCloseAngle, transform.localRotation.z);
		// Dampen towards the target rotation
		transform.localRotation = Quaternion.Slerp(transform.localRotation, target1,
		Time.deltaTime * smooth);
	}

	if(enter == true)
	{
		if(Input.GetKeyDown("f"))
		{
			open = !open;
		}
	}
}

//Activate the Main function when player is near the door
function OnTriggerEnter (other : Collider)
{
	if (other.gameObject.tag == "Player") 
	{
		Debug.Log("Trigger Enter");
		(enter) = true;
	}
}

//Deactivate the Main function when player is go away from door
function OnTriggerExit (other : Collider)
{
	if (other.gameObject.tag == "Player") 
	{
		Debug.Log("Trigger Exit");
		(enter) = false;
	}
}
//@youtube.com/user/maksimum654321