using UnityEngine;
using System.Collections;

public class walkingScript : MonoBehaviour {
	private Animation anim;
	// Use this for initialization
	void Start () {
//		GetComponent<Animation> ().enabled;
		//anim = new Animator();
		anim = GetComponent<Animation>();
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKeyDown ("w")) {
			//GetComponent<Animation>().Play("Walkinganimation",PlayMode.StopAll);
			anim.Play ("walkinganimation", PlayMode.StopAll);
		} else if (Input.GetKeyUp ("w")) {
			anim.Stop();
		}
	
	}
}
