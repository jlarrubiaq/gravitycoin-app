import { Mongo } from "meteor/mongo";

export let Ethaccounts = new Mongo.Collection("ethaccounts");
export let Ethtransfers = new Mongo.Collection("ethtransfers");