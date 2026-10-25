import json


def extract(fileobj, *args, **kwargs):
	"""Extract the names of the standard financial account categories."""
	categories = json.load(fileobj)

	if not isinstance(categories, list):
		return

	for category in categories:
		yield None, "_", category.get("account_category_name"), ["Name of an Account Category"]
