using UnityEngine;
using System.Collections;

//Instruction:
//Make an empty game object and call it "Door"
//Rename your 3D door model to "Body"
//Parent a "Body" object to "Door"
//Make sure thet a "Door" object is in left down corner of "Body" object. The place where a Door Hinge need be
//Add a box collider to "Door" object and make it much bigger then the "Body" model, mark it trigger
//Assign this script to a "Door" game object that have box collider with trigger enabled
//Press "e" (Default) to open and close the door
//Make sure the main character is tagged "player"

public class open_door : MonoBehaviour 
{
	public float smooth = (float)2.0;
	public float DoorOpenAngle = (float)110.0;
	public float DoorCloseAngle = (float)0.0;
	public bool open = false;
	public bool enter = false;
	public string defined_key = "e";
	
	// Update is called once per frame
	void Update () 
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
			if(Input.GetKeyDown(defined_key))
			{
				open = !open;
			}
		}	
	}

	//Activate the Main function when player is near the door
	void OnTriggerEnter(Collider other)
	{
		if (other.gameObject.tag == "Player") 
		{
			//Debug.Log("Trigger Enter");
			(enter) = true;
		}
	}
	
	//Deactivate the Main function when player is go away from door
	void OnTriggerExit (Collider other)
	{
		if (other.gameObject.tag == "Player") 
		{
			//Debug.Log("Trigger Exit");
			(enter) = false;
		}
	}
	//@youtube.com/user/maksimum654321
}

