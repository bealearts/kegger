import execBrew from './execBrew';

export default function updateBrew() {
    return execBrew('update --quiet');
}
