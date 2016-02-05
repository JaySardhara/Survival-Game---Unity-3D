using UnityEngine;
using System.Collections;

public class Throw : MonoBehaviour {

    public GameObject projectile;
    public AudioClip shootClip;

    private float throwSpeed = 2000f;
    private AudioSource src;
    private float volLow = 0.5f;
    private float volHigh = 1f;
	public Transform player = GameObject.FindWithTag("Player").transform;
	public float range =  50.0f;
	public float bulletImpulse = 20.0f;

	private bool onRange = false;



	// Use this for initialization
	void Start () {

        src = GetComponent<AudioSource>();
		float rand =  Random.Range (1.0f, 2.0f);
		InvokeRepeating("Shoot", 2, rand);
	}

	void Shoot()
	{
		if (onRange) {
			Rigidbody bullet = (Rigidbody)Instantiate (projectile, transform.position + transform.forward, transform.rotation);
			bullet.AddForce (transform.forward*bulletImpulse, ForceMode.Impulse);

			Destroy (bullet.gameObject, 2);
		}
	}

	// Update is called once per frame
	void Update () {


        if (Input.GetButtonDown("Fire1"))
        {
            //set audio
            src.PlayOneShot(shootClip,1f);

            GameObject throwThis = Instantiate(projectile, transform.position, transform.rotation) as GameObject;

            throwThis.GetComponent<Rigidbody>().AddRelativeForce( new Vector3(0,0,throwSpeed) );
			onRange = Vector3.Distance (transform.position, player.position) < range;
			if (onRange)
				transform.LookAt (player);

        }

	}
}
