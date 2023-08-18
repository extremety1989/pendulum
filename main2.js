import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.135.0/build/three.module.js';
    import { Ammo } from './ammo.js'; // Load Ammo.js from your local directory

    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create the Ammo.js world
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    const overlappingPairCache = new Ammo.btDbvtBroadphase();
    const solver = new Ammo.btSequentialImpulseConstraintSolver();
    const physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0)); // Set gravity

    // Create the pendulum rod and bob
    const rodGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 32);
    const rodMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const rodMesh = new THREE.Mesh(rodGeometry, rodMaterial);
    scene.add(rodMesh);

    const bobGeometry = new THREE.SphereGeometry(1, 32, 32);
    const bobMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const bobMesh = new THREE.Mesh(bobGeometry, bobMaterial);
    scene.add(bobMesh);

    // Create the compound pendulum body and shape
    const pendulumShape = new Ammo.btCapsuleShape(0.1, 2.5);
    const pendulumTransform = new Ammo.btTransform();
    pendulumTransform.setIdentity();
    pendulumTransform.setOrigin(new Ammo.btVector3(0, -2.5, 0));
    const pendulumMotionState = new Ammo.btDefaultMotionState(pendulumTransform);
    const pendulumInertia = new Ammo.btVector3(0, 0, 0);
    pendulumShape.calculateLocalInertia(1, pendulumInertia);
    const pendulumRigidBodyCI = new Ammo.btRigidBodyConstructionInfo(1, pendulumMotionState, pendulumShape, pendulumInertia);
    const pendulumRigidBody = new Ammo.btRigidBody(pendulumRigidBodyCI);

    // Add the pendulum body to the physics world
    physicsWorld.addRigidBody(pendulumRigidBody);

    // Set up camera position
    camera.position.z = 10;

    // Animation loop
    function animate() {
      physicsWorld.stepSimulation(1 / 60, 10);

      const transform = new Ammo.btTransform();
      pendulumRigidBody.getMotionState().getWorldTransform(transform);
      const position = transform.getOrigin();
      const rotation = transform.getRotation();
      
      // Update the position and rotation of the Three.js objects based on the physics simulation
      rodMesh.position.set(position.x(), position.y(), position.z());
      rodMesh.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
      bobMesh.position.set(position.x(), position.y() - 2.5, position.z());

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    // Start the animation loop
    animate();